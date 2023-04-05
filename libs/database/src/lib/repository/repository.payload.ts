import {
  IResponseProfile,
  IResponseVehicle,
} from "../interface/account.interface";
import { Account } from "../schema/account.schema";
import { Vehicle } from "../schema/vehicle.schema";

export class PayloadResponse {
  static toVehicleResponse<T>(
    vehicle: Vehicle,
    options?: Record<string, T>
  ): IResponseVehicle {
    return {
      brand: vehicle.brand,
      model: vehicle.model,
      vehicleRegistration: vehicle.vehicleRegistration,
      registrationProvince: vehicle.registrationProvince,
      ...options,
    };
  }

  static toProfileResponse(account: Account): IResponseProfile {
    return {
      email: account.email,
      displayName: account.displayName,
      mobile: account.mobile,
    };
  }
}
