import { Router } from "express";
import {
  issueBook,
  returnBook,
  getAllIssues,
  getActiveIssues,
} from "../controllers/issue.controller";

const router = Router();

router.get("/active", getActiveIssues);
router.post("/", issueBook);
router.post("/:id/return", returnBook);
router.get("/", getAllIssues);

export default router;
