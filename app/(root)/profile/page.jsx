"use client";

import Loader from "@components/Loader";
import { PersonOutline } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Profile = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      reset({
        username: user?.username,
        profileImage: user?.profileImage,
      });
    }
    setLoading(false);
  }, [user]);

  const {
    register,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { error },
  } = useForm();

  const uploadPhoto = (result) => {
    setValue("profileImage", result?.info?.secure_url);
  };

  const updateUser = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user._id}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="profile-page">
      <h1 className="text-heading3-bold">Редактировать</h1>

      <form className="edit-profile" onSubmit={handleSubmit(updateUser)}>
        <div className="input">
          <input
            {...register("username", {
              required: "добавьте имя",
              validate: (value) => {
                if (value.length < 3) {
                  return "Имя должно быть больше 3 букв";
                }
              },
            })}
            type="text"
            placeholder="Имя пользователя"
            className="input-field"
          />
          <PersonOutline sx={{ color: "#737373" }} />
        </div>
        {error?.username && (
          <p className="text-red-500">{error.username.message}</p>
        )}

        <div className="flex items-center justify-between">
          <img
            src={
              watch("profileImage") ||
              user?.profileImage ||
              "/assets/men1.png"
            }
            alt="profile"
            className="w-40 h-40 rounded-full"
          />
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={uploadPhoto}
            uploadPreset="ffa3ie9o"
          >
            <p className="text-body-bold">Загрузить фото</p>
          </CldUploadButton>
        </div>

        <button className="btn" type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default Profile;


