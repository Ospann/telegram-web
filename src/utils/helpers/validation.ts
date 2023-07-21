import IFormData from "../interfaces/IFormData";

const validation = (formData: IFormData) => {
  return (
    formData.client !== "" &&
    formData.project !== "" &&
    (formData.hour !== "" || formData.minute !== "") &&
    formData.date !== ""
  );
};

export default validation;
