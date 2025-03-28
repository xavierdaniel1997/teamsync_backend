
export interface IPlan{
    id?: string;
    name: string;
    stripePriceId: string | undefined;
    stripeProductId: string | undefined;
    price: Number;
    projectLimit: Number;
    memberLimit: Number;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}



  //duration date