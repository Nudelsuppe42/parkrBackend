import { UserController } from "./routes/UserController";

interface RouteProps {
  method: string;
  route: string;
  controller: any;
  action: string;
  auth: "admin" | "user" | "anonym";
}

const routes: RouteProps[] = [
  /*
  {
    method: "",
    route: "",
    controller: Controller,
    action: "",
    permission: Permissions.default,
  }
 */
  {
    method: "GET",
    route: "/users",
    controller: UserController,
    action: "getAll",
    auth: "admin",
  },
  {
    method: "POST",
    route: "/users",
    controller: UserController,
    action: "create",
    auth: "anonym",
  },
  {
    method: "POST",
    route: "/login",
    controller: UserController,
    action: "login",
    auth: "anonym",
  },
  {
    method: "GET",
    route: "/users/:id",
    controller: UserController,
    action: "get",
    auth: "anonym", // Handler later
  },
  {
    method: "POST",
    route: "/users/:id/delete",
    controller: UserController,
    action: "delete",
    auth: "admin",
  },
];

export default routes;
