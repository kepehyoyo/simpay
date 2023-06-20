

export class UserAuthService{

static async checkUserAuth(userId:string, password:string){
     // Check if user is authorized to make payments
     const isUserAuthorized = await UserAuthService.checkUserAuthorization(userId);
     if (!isUserAuthorized) {
       console.log(`User ${userId} is not authorized to make payments.`);
       return false;
     }

     const isUserAuthenticated= await UserAuthService.checkUserAuthentication(userId,password);
     if (!isUserAuthorized) {
       console.log(`User ${userId} is not authorized to make payments.`);
       return false;
     }


}
static async checkUserAuthentication(username: string, password: string): Promise<boolean> {
    // Authenticate user based on username and password
    // Return true if user is authenticated, false otherwise
    return true;
  }
  
 
static  async checkUserAuthorization(userId: string): Promise<boolean> {
    // Perform user authorization check, e.g., check if user is active and not banned
    // Return true if user is authorized, false otherwise
    return true;
  }
}