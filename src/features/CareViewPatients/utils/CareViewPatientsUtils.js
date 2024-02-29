import axios from "axios";
import { GET_PATIENT_LIST_URL } from "../../../constants";

export const fetchPatientsList = async (wardId, offset, limit = 3) => {
  return await axios.get(GET_PATIENT_LIST_URL.replace("{wardId}", wardId), {
    params: { offset, limit },
  });
};