import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../app/api";
import { useAuthStore } from "@/app/store";

export const useDjangoAuth = () => {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authenticatedTrue = useAuthStore((state) => state.authenticatedTrue);
  const authenticatedFalse = useAuthStore((state) => state.authenticatedFalse);
  const loadingTrue = useAuthStore((state) => state.loadingTrue);
  const loadingFalse = useAuthStore((state) => state.loadingFalse);
  const setUser = useAuthStore((state) => state.setUser);

  const defaultUser = { id: -1, username: "", avatar: "", email: "" };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser();
    }
  }, [isAuthenticated]);

  const auth = async (
    e: React.FormEvent<HTMLFormElement>,
    modal: HTMLDialogElement | null
  ) => {
    const formData = new FormData(e.currentTarget);
    try {
      loadingTrue();
      const res = await api.post("/api/token/", {
        username: formData.get("username"),
        password: formData.get("password"),
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      authenticatedTrue();
      loadingFalse();
      modal?.close();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "there is an error";
      if (errorMsg.includes("401")) {
        alert("incorrect username or password");
      } else {
        alert(errorMsg);
      }
      loadingFalse();
    }
  };

  const oauth = async (code: string) => {
    if (code) {
      try {
        loadingTrue();
        const res = await api.post("/api/github/", { code: code });
        if (res.data) {
          localStorage.setItem("access", res.data["access_token"]);
          localStorage.setItem("refresh", res.data["refresh_token"]);
          authenticatedTrue();
        }
        router.push("/");
        loadingFalse();
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "there is an error";
        if (errorMsg.includes("401")) {
          alert("incorrect username or password");
        } else {
          alert(errorMsg);
        }
        loadingFalse();
      }
    }
  };

  const checkToken = async () => {
    loadingTrue();
    const token = localStorage.getItem("access");
    if (!token) {
      authenticatedFalse();
      loadingFalse();
      return;
    }
    if (isTokenActive(token)) {
      authenticatedTrue();
    } else {
      await checkRefreshToken();
      const secondToken = localStorage.getItem("access");
      if (secondToken && isTokenActive(secondToken)) {
        authenticatedTrue();
      }
    }
    loadingFalse();
  };

  const isTokenActive = (token: string) => {
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp!!;
    const now = Date.now() / 1000;
    return tokenExpiration > now;
  };

  const checkRefreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    try {
      const res = await api.post("/api/token/refresh/", { refresh });
      localStorage.setItem("access", res.data.access);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "there is an error";
      if (!errorMsg.includes("401")) {
        alert(errorMsg);
      }
    }
  };

  const getCurrentUser = async () => {
    try {
      const res = await api.get("/api/user/");
      const { avatar, user } = res.data;
      setUser({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    authenticatedFalse();
    localStorage.removeItem("refresh");
    localStorage.removeItem("access");
  };

  return { auth, oauth, checkToken, logout };
};
