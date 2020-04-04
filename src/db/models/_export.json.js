import CreditCardsSingletons, { Table as CreditCards } from "./CreditCards.json";
import MessagesSingletons, { Table as Messages } from "./Messages.json";
import AccountSingletons, { Table as Sessions } from "./Sessions.json";
import SessionsSingletons, { Table as Subscription } from "./Subscription.json";
import SubscriptionSingletons, { Table as Account } from "./Account.json";
import EmailAccountSingletons, { Table as EmailAccount } from "./EmailAccount.json";
import AccountPagesSingletons, { Table as AccountPages } from "./AccountPages.json.js";

export default {
  CreditCards,
  Messages,
  AccountPages,
  Account,
  Sessions,
  Subscription,
  EmailAccount,
};

// export const Models = {
//   CreditCardsModel,
//   MessagesModel,
//   PageTemplatesModel,
//   AccountModel,
//   SessionsModel,
//   SubscriptionModel,
//   EmailAccountModel,
// };

export const Singletons = {
  CreditCardsSingletons,
  MessagesSingletons,
  AccountPagesSingletons,
  AccountSingletons,
  SessionsSingletons,
  SubscriptionSingletons,
  EmailAccountSingletons,
};
