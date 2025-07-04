import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(
    requireBody(["username", "password", "admin", "member_since", "email"]),
    async (req, res) => {
      const { username, password, admin, member_since, email } = req.body;
      const user = await createUser(username, password);

      const token = await createToken({ id: user.id });
      res.status(201).send(token);
    }
  );

router
  .route("/login")
  .post(
    requireBody(["username", "password", "admin", "member_since", "email"]),
    async (req, res) => {
      const { username, password, admin, member_since, email } = req.body;
      const user = await getUserByUsernameAndPassword(username, password);
      if (!user) return res.status(401).send("Invalid username or password.");

      const token = await createToken({ id: user.id });
      res.send(token);
    }
  );

router.route("/:username").get(async (req, res) => {
  const id = req.user.id;
  if (req.user.id !== req.task.user_id) {
    return res.status(403).send("You are not authorized to delete this task.");
  }
  //getUserProfile will need to be a query
  //joining users and favorites
  const profile = getUserProfile(id);
  res.send(profile);
});
