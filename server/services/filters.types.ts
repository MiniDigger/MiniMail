export interface Condition {
  field: "subject" | "from" | "to" | "cc" | "bcc" | "body" | "date" | "size" | "priority" | "status";
}

export interface ModifierCondition extends Condition {
  modifier: "contains" | "does not contain" | "is" | "is not" | "begins with" | "ends with";
  value: string;
}

export interface RegexCondition extends Condition {
  regex: string;
}

export interface Action {
  type: "move to folder" | "mark as read" | "delete" | "flag";
  value?: string;
}

export interface Filter {
  id: string;
  match: "any" | "all" | "always";
  conditions: (ModifierCondition | RegexCondition)[];
  actions: Action[];
  inboxes: string[] | "global";
}
