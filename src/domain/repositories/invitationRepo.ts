import { IInvitation } from "../entities/invitation";


export interface IInvitationRepo {
  create(invitation: Partial<IInvitation>): Promise<IInvitation>;
  findByToken(token: string): Promise<IInvitation | null>;
  update(token: string, updateData: Partial<IInvitation>): Promise<IInvitation | null>;
}