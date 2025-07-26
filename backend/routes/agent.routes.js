import express from "express";
import { handleChat } from "../controllers/agent.controller.js";

const agentRouter = express.Router();

agentRouter.post("/chat", handleChat);

export default agentRouter;
