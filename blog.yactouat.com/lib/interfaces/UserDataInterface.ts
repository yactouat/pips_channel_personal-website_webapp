import { SocialHandleType } from "pips_resources_definitions/dist/types";

interface UserProfileDataInterface {
  email: string;
  password?: string;
  socialhandle: string;
  socialhandletype: SocialHandleType;
  verified?: boolean;
}

export default UserProfileDataInterface;
