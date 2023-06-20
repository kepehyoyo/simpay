import { assign, createMachine, StateMachine } from 'xstate';

interface TransactionStateMachineContext {
  queue: TransactionStateMachineEvent[];
  currentState: string;
}

type TransactionStateMachineEvent =
  | { type: 'VALIDATED' }
  | { type: 'AUTHORIZED' }
  | { type: 'COMPLETED' }
  | { type: 'FAILED' };

export type TransactionStateMachine =
  StateMachine<TransactionStateMachineContext, any, TransactionStateMachineEvent>;

const stateMachines: Record<string, TransactionStateMachine> = {};

const transactionGuards = {
  isPending: (ctx: TransactionStateMachineContext) => {
    return ctx.queue.length === 0;
  },
  isValidated: (ctx: TransactionStateMachineContext) => {
    return ctx.currentState === 'pending' && ctx.queue.length > 0 && ctx.queue[0].type === 'VALIDATED';
  },
  isAuthorized: (ctx: TransactionStateMachineContext) => {
    return ctx.currentState === 'validated' && ctx.queue.length > 0 && ctx.queue[0].type === 'AUTHORIZED';
  },
};

const transactionActions = {
  addToQueue: (ctx: TransactionStateMachineContext, event: TransactionStateMachineEvent) => {
    ctx.queue.push(event);
    console.log(`Added event type "${event.type}" to queue`);
  },
  processQueue: (ctx: TransactionStateMachineContext, event: TransactionStateMachineEvent) => {
    while (ctx.queue.length > 0) {
      const queuedEvent = ctx.queue[0];
      if (queuedEvent.type === 'VALIDATED' && transactionGuards.isValidated(ctx)) {
        ctx.queue.shift();
        ctx.currentState = 'validated';
        console.log(`Processed event type "${queuedEvent.type}"`);
        return;
      } else if (queuedEvent.type === 'AUTHORIZED' && transactionGuards.isAuthorized(ctx)) {
        ctx.queue.shift();
        ctx.currentState = 'authorized';
        console.log(`Processed event type "${queuedEvent.type}"`);
        return;
      } else if (queuedEvent.type === 'COMPLETED') {
        ctx.queue.shift();
        ctx.currentState = 'completed';
        console.log(`Processed event type "${queuedEvent.type}"`);
        return;
      } else if (queuedEvent.type === 'FAILED') {
        ctx.queue.shift();
        ctx.currentState = 'failed';
        console.log(`Processed event type "${queuedEvent.type}"`);
        return;
      } else {
        // event cannot be processed, break loop
        break;
      }
    }
  },
};

export function createTransactionStateMachine(
  transactionId: string
): TransactionStateMachine {
  const transactionStateMachine = createMachine<
    TransactionStateMachineContext,
    TransactionStateMachineEvent
  >(
    {
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
          entry: assign({
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
    },
    {
      actions: transactionActions,
    
    }
  );

  return transactionStateMachine;
}

export function getTransactionStateMachine(
  transactionId: string
): TransactionStateMachine {
  if (!stateMachines[transactionId]) {
    stateMachines[transactionId] = createTransactionStateMachine(transactionId);
  }

  return stateMachines[transactionId];
}
