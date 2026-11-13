import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
//get all acounts
//get/api/accounts



export const getAccounts = async (req: AuthRequest, res: Response): Promise<void> => {

    try {
        const accounts = await Account.find({ user: req.user._id })

        res.json(accounts)
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "server error " });


    }



}


//add accounts
//post/api/accounts


export const addAccounts = async (req: AuthRequest, res: Response): Promise<void> => {

    try {

        const { platform, handle, avatarUrl } = req.body;

        const account = await Account.create({ user: req.user._id, platform, handle, avatarUrl });
        res.status(201).json(account)
    } catch (error: any) {
        res.status(500).json({ message: error?.message || "server error " });


    }
}

//disconnect account
//delete / api/accounts/:id

export const disconnectAccounts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const account = await Account.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    // TODO: Remove account from Zernio when correct SDK method is confirmed.

    await account.deleteOne();

    res.json({
      message: "Account disconnected successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Server error",
    });
  }
};