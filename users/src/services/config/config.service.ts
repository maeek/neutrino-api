import { RESERVED_USERNAMES } from '../../constants';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;
  private readonly restrictedUsernames: string[] = [];
  private readonly saltRounds = 10;

  constructor() {
    this.envConfig = {
      rabbitmqUrl: process.env.RABBITMQ_URL,
      userQueue: process.env.RABBITMQ_USER_QUEUE,
    };

    this.restrictedUsernames = RESERVED_USERNAMES;
  }

  get(key: string): any {
    return this.envConfig[key];
  }

  getRestrictedUsernames() {
    return this.restrictedUsernames;
  }

  getSaltRounds() {
    return this.saltRounds;
  }
}
