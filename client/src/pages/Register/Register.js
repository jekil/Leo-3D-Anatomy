import React from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import InputForm from "../../components/atoms/InputForm/InputForm";
import Button from "../../components/Button/Button";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../services/api";
import LayoutAuth from "../LayoutAuth/LayoutAuth";

export default function Register() {
  const { login } = useAuth();
  const history = useHistory();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    if (data.password !== data.confPassword) {
      setError("confPassword", { type: "custom", message: "The passwords do not match" });
    }

    const user = await registerUser(data);

    login(user);

    history.push("/dashboard");
  };

  return (
    <LayoutAuth title="Register">
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mb-3">
          <InputForm
            label="First name"
            id="firstName"
            type="text"
            classNameLabel="form__label-black"
            classNameInput="form__input"
            register={register}
            required={"This field is required"}
          />
          {errors.firstName && <div className="form__error">{errors.firstName.message}</div>}
        </div>
        <div className="w-full mb-3">
          <InputForm
            label="Last name"
            id="lastName"
            type="text"
            classNameLabel="form__label-black"
            classNameInput="form__input"
            register={register}
            required={"This field is required"}
          />
          {errors.lastName && <div className="form__error">{errors.lastName.message}</div>}
        </div>
        <div className="w-full mb-3">
          <InputForm
            label="Email"
            id="email"
            type="email"
            classNameLabel="form__label-black"
            classNameInput="form__input"
            register={register}
            required={"This field is required"}
          />
          {errors.email && <div className="form__error">{errors.email.message}</div>}
        </div>
        <div className="w-full mb-3">
          <InputForm
            label="Password"
            id="password"
            type="password"
            classNameLabel="form__label-black"
            classNameInput="form__input"
            register={register}
            required={"This field is required"}
          />
          {errors.password && <div className="form__error">{errors.password.message}</div>}
        </div>
        <div className="w-full mb-8">
          <InputForm
            label="Confirm Password"
            id="confPassword"
            type="password"
            classNameLabel="form__label-black"
            classNameInput="form__input"
            register={register}
            required={"This field is required"}
          />
          {errors.confPassword && <div className="form__error">{errors.confPassword.message}</div>}
        </div>
        <div className="flex flex-col gap-4">
          <Button type="submit" typeClass="modal__btn-confirm w-full" text="Create Account" />
          <Link to="/" className="w-full no-underline">
            <Button type="button" typeClass="modal__btn-confirm w-full" text="Login" />
          </Link>
        </div>
      </form>
    </LayoutAuth>
  );
}
