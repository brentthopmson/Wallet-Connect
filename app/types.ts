export interface User {
  userId: string;
  admin: string;
  position: string;
  fullName: string;
  phoneNumber: string;
  textMessage: string;
  interviewLink: string;
  emailAddress: string;
  timeIn: string;
  interviewResponse: string;
  timeOut: string;
  userFolderId?: string;
  frontId: string;
  backId: string;
  selfie: string;
  resume: string;
  adminApprovalTime: string;
  signedLetter: string;
  paymentMethod: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  address: string;
  payCount: string;
  totalAmount: string;
  totalPayout: string;
  route: string;
  titleStatus: string;
  messageStatus: string;
  warningStatus?: string;
  systemStatus: string;
  percentageStatus: string;
  adminStatus: string;
  adminSMSStatus: string;
  adminApprovalTimeX7: string;

  
  username: string; // Add username field
}