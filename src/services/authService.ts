import axios from "axios";

export const register = async (form: Record<string, string>) => {
  try {
    const res = await axios.post("/api/register", form);

    const { success, message } = res.data;

    if (!success) {
      throw new Error(message || "Gagal mendaftar");
    }

    return { success, message };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Gagal mendaftar");
  }
};

export const updateProfile = async (form: Record<string, string>) => {
  try {
    const res = await axios.put("api/profile", form, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { success, message, user } = res.data;

    if (!success) {
      throw new Error("Gagal memperbarui profil");
    }

    return { success, message, user };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Gagal memperbarui profil");
  }
};
