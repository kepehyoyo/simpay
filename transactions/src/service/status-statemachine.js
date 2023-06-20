"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionStateMachine = exports.createTransactionStateMachine = void 0;
const xstate_1 = require("xstate");
const stateMachines = {};
const transactionGuards = {
    isPending: (ctx) => {
        return ctx.queue.length === 0;
    },
    isValidated: (ctx) => {
        return ctx.currentState === 'pending' && ctx.queue.length > 0 && ctx.queue[0].type === 'VALIDATED';
    },
    isAuthorized: (ctx) => {
        return ctx.currentState === 'validated' && ctx.queue.length > 0 && ctx.queue[0].type === 'AUTHORIZED';
    },
};
const transactionActions = {
    addToQueue: (ctx, event) => {
        ctx.queue.push(event);
        console.log(`Added event type "${event.type}" to queue`);
    },
    processQueue: (ctx, event) => {
        while (ctx.queue.length > 0) {
            const queuedEvent = ctx.queue[0];
            if (queuedEvent.type === 'VALIDATED' && transactionGuards.isValidated(ctx)) {
                ctx.queue.shift();
                ctx.currentState = 'validated';
                console.log(`Processed event type "${queuedEvent.type}"`);
                return;
            }
            else if (queuedEvent.type === 'AUTHORIZED' && transactionGuards.isAuthorized(ctx)) {
                ctx.queue.shift();
                ctx.currentState = 'authorized';
                console.log(`Processed event type "${queuedEvent.type}"`);
                return;
            }
            else if (queuedEvent.type === 'COMPLETED') {
                ctx.queue.shift();
                ctx.currentState = 'completed';
                console.log(`Processed event type "${queuedEvent.type}"`);
                return;
            }
            else if (queuedEvent.type === 'FAILED') {
                ctx.queue.shift();
                ctx.currentState = 'failed';
                console.log(`Processed event type "${queuedEvent.type}"`);
                return;
            }
            else {
                // event cannot be processed, break loop
                break;
            }
        }
    },
};
function createTransactionStateMachine(transactionId) {
    const transactionStateMachine = (0, xstate_1.createMachine)({
        id: `transaction-${transactionId}`,
        initial: 'pending',
        context: {
            queue: [],
            currentState: '',
        },
        states: {
            pending: {
                entry: 'processQueue',
                on: {
                    VALIDATED: {
                        actions: ['addToQueue'],
                        target: 'validated',
                    },
                    FAILED: {
                        target: 'failed',
                    },
                },
            },
            validated: {
                entry: (0, xstate_1.assign)({
                    currentState: 'pending',
                    queue: (ctx, event) => [],
                }),
                on: {
                    AUTHORIZED: {
                        actions: ['addToQueue'],
                        target: 'authorized',
                    },
                    COMPLETED: {
                        actions: ['addToQueue'],
                        target: 'completed',
                    },
                    FAILED: {
                        target: 'failed',
                    },
                },
            },
            authorized: {
                entry: 'processQueue',
                on: {
                    COMPLETED: {
                        actions: ['addToQueue'],
                        target: 'completed',
                    },
                    FAILED: {
                        target: 'failed',
                    },
                },
            },
            completed: {
                type: 'final',
            },
            failed: {
                type: 'final',
            },
        },
    }, {
        actions: transactionActions,
    });
    return transactionStateMachine;
}
exports.createTransactionStateMachine = createTransactionStateMachine;
function getTransactionStateMachine(transactionId) {
    if (!stateMachines[transactionId]) {
        stateMachines[transactionId] = createTransactionStateMachine(transactionId);
    }
    return stateMachines[transactionId];
}
exports.getTransactionStateMachine = getTransactionStateMachine;
