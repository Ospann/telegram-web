import IFormData from "../interfaces/IFormData";

const HourService = {
  async getProjects() {
    const response = await fetch("https://test.maxinum.kz/api/hours/meta");
    return response.json();
  },

  async create(info: IFormData) {
    fetch("https://test.maxinum.kz/api/hours/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    });
  },
};

export default HourService;
