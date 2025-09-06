export interface MailAccount {
  user: string;
  pass: string;
}

export interface Mail {
  seq: number;
  messageId: string;
  subject: string;
  date: Date;
  from: MailAddress[];
  to: MailAddress[];
  replyTo: MailAddress[];
  body?: string;
  flags: {
    seen: boolean;
    flagged: string | undefined;
    answered: boolean;
  };
  flagColor?: string;
}

export interface MailAddress {
  name: string;
  address: string;
}

declare module "nitropack/types" {
  interface NitroRuntimeHooks {
    "minimail:mail": (mail: Mail) => void;
  }
}
