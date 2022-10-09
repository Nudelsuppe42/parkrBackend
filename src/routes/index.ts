import { ServiceStationController } from "./routes/serviceStationController";
import { UserController } from "./routes/UserController";
import { VehicleController } from "./routes/vehicleController";

interface RouteProps {
  method: string;
  route: string;
  controller: any;
  action: string;
  auth: "admin" | "user" | "anonym" | "specific";
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
    auth: "specific",
  },
  {
    method: "POST",
    route: "/users/:id",
    controller: UserController,
    action: "update",
    auth: "specific",
  },
  {
    method: "POST",
    route: "/users/:id/delete",
    controller: UserController,
    action: "delete",
    auth: "admin",
  },
  {
    method: "GET",
    route: "/users/:id/vehicle",
    controller: VehicleController,
    action: "get",
    auth: "specific",
  },
  {
    method: "POST",
    route: "/users/:id/vehicle/create",
    controller: VehicleController,
    action: "create",
    auth: "specific",
  },
  {
    method: "POST",
    route: "/users/:id/vehicle",
    controller: VehicleController,
    action: "update",
    auth: "specific",
  },
  {
    method: "GET",
    route: "/stations",
    controller: ServiceStationController,
    action: "getAll",
    auth: "anonym",
  },
  {
    method: "GET",
    route: "/stations/:vid",
    controller: ServiceStationController,
    action: "get",
    auth: "anonym",
  },
  {
    method: "POST",
    route: "/stations",
    controller: ServiceStationController,
    action: "create",
    auth: "admin",
  },
];

export default routes;
