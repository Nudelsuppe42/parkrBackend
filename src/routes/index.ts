import { UserController } from "./routes/UserController";

interface RouteProps {
  method: string;
  route: string;
  controller: any;
  action: string;
  //permission: any,
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
    action: "get",
    //permission: Permissions.default,
  },
  {
    method: "POST",
    route: "/users",
    controller: UserController,
    action: "create",
    //permission: Permissions.default,
  },
  {
    method: "POST",
    route: "/login",
    controller: UserController,
    action: "login",
    //permission: Permissions.default,
  },
];

export default routes;
