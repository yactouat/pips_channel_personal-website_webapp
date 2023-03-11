import { SocialHandleType } from "pips_resources_definitions/dist/types";

interface UserProfileDataInterface {
  email: string;
  hasPendingModifications?: boolean;
  password?: string;
  socialhandle: string;
  socialhandletype: SocialHandleType;
  verified?: boolean;
}

export default UserProfileDataInterface;
