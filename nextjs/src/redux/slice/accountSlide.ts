import accountApiRequest from "@/apiRequests/account";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// First, create the thunk
export const fetchAccount = createAsyncThunk(
  "account/fetchAccount",
  async (access_token: string) => {
    const response = await accountApiRequest.callFetchAccount(access_token);
    console.log(response);
    return response.data;
  }
);

interface IState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshToken: boolean;
  errorRefreshToken: string;
  user: {
    id: number | null;
    email: string;
    name: string;
    phone: string;
    urlCV?: string;
    avatar?: string;
    notifies?: {
      id: number;
      status?: string;
      title?: string;
      description?: string;
      isActive?: boolean;
      jobId?: number;
      nameJob?: string;
      createdAt?: string;
    }[];
    company?: {
      id: number | null;
      name: string;
    };
    role: {
      id: number | null;
      name: string;
    };
    permissions: {
      id: number | null;
      name: string;
      apiPath: string;
      method: string;
      module: string;
    }[];
  };
  activeMenu: string;
}

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: "",
  user: {
    id: null,
    email: "",
    name: "",
    phone: "",
    urlCV: "",
    avatar: "",
    notifies: [],
    company: {
      id: null,
      name: "",
    },
    role: {
      id: null,
      name: "",
    },
    permissions: [],
  },

  activeMenu: "home",
};

export const accountSlide = createSlice({
  name: "account",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user.id = action?.payload?.id;
      state.user.email = action.payload.email;
      state.user.name = action.payload.name;
      state.user.phone = action.payload.phone;
      state.user.urlCV = action?.payload?.urlCV;
      state.user.avatar = action?.payload?.avatar;
      state.user.notifies = action?.payload?.notifies;
      state.user.company = action?.payload?.company;
      state.user.role = action?.payload?.role;
      state.user.permissions = action?.payload?.permissions;
    },
    setUserUpdateInfo: (state, action) => {
      state.user.name = action.payload.name;
      state.user.phone = action.payload.phone;
    },
    setUserAvatar: (state, action) => {
      state.user.avatar = action.payload.avatar;
    },
    setUserCV: (state, action) => {
      state.user.urlCV = action.payload.urlCV;
    },
    setLogoutAction: (state, action) => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("accessTokenExpiresAt");
      state.isAuthenticated = false;
      state.user = {
        id: null,
        email: "",
        name: "",
        phone: "",
        urlCV: "",
        avatar: "",
        notifies: [],
        company: {
          id: null,
          name: "",
        },
        role: {
          id: null,
          name: "",
        },
        permissions: [],
      };
    },
    setRefreshTokenAction: (state, action) => {
      state.isRefreshToken = action.payload?.status ?? false;
      state.errorRefreshToken = action.payload?.message ?? "";
    },
  },

  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchAccount.pending, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = true;
      }
    });

    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user.id = action?.payload?.user?.id;
        state.user.email = action.payload?.user?.email;
        state.user.name = action.payload?.user?.name;
        state.user.phone = action.payload?.user?.phone;
        state.user.notifies = action.payload?.user?.notifies;
        state.user.company = action.payload?.user?.company;
        state.user.urlCV = action.payload?.user?.urlCV;
        state.user.avatar = action.payload?.user?.avatar;
        state.user.role = action?.payload?.user?.role;
        state.user.permissions = action?.payload?.user?.permissions;
      }
    });

    builder.addCase(fetchAccount.rejected, (state, action) => {
      if (action.payload) {
        state.isAuthenticated = false;
        state.isLoading = false;
      }
    });
  },
});

export const {
  setActiveMenu,
  setUserLoginInfo,
  setUserUpdateInfo,
  setUserAvatar,
  setUserCV,
  setLogoutAction,
  setRefreshTokenAction,
} = accountSlide.actions;

export default accountSlide.reducer;
