import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllFeatures, setAllowedFeatures } from "../core/data/redux/featureSlice";
import axiosClient from "../axiosConfig/axiosClient";
import { FETCH_ALL_FEATURES, FETCH_ROLE_FEATURES, FETCH_USER_DETAILS } from "../axiosConfig/apis";
import { setUser } from "../core/data/redux/authSlice";
import { fetchRoles } from "../core/data/redux/rolesSlice";
import { AppDispatch, RootState } from "../core/data/redux/store";
import { fetchCompanies } from "../core/data/redux/companySlice";
import { fetchBranches } from "../core/data/redux/branchesSlice";
import { fetchUsers } from "../core/data/redux/usersSlice";
import { useNavigate } from "react-router-dom"; // Import useNavigate to redirect
import { fetchDepartments } from "../core/data/redux/departmentsSlice";

const AppInitializer = ({ onReady }: { onReady: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // Initialize useNavigate
  const userSaved = useSelector((state: RootState) => state.auth.user);
  const { sortField, sortOrder } = useSelector((state: RootState) => state.users);

  const fetchFeatures = async () => {
    try {
      const response = await axiosClient.get(FETCH_ALL_FEATURES);
      const response2 = await axiosClient.get(FETCH_ROLE_FEATURES);
      if (response.status === 200 && response2.status === 200) {
        dispatch(setAllFeatures(response.data));
        dispatch(setAllowedFeatures(response2.data));
      }
    } catch (error) {
      console.log("Feature fetch error", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axiosClient.get(FETCH_USER_DETAILS);
      if (response.status === 200) {
        dispatch(setUser(response.data));
      }
    } catch (error: any) {
      console.error("Unexpected error fetching user:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchUser();
    };
    if (!userSaved?.id) {
      initialize();
    }
  }, []);

  useEffect(() => {
    const initializeWithUser = async () => {
      if (userSaved?.id) {
        await fetchFeatures();
        await dispatch(fetchRoles());
        await dispatch(fetchCompanies());
        await dispatch(fetchBranches());
        await dispatch(fetchDepartments());
        await dispatch(fetchUsers({
          companyId: undefined,
          branchId: undefined,
          roleId: undefined,
          page: 1,
          limit: 10,
          sortField,
          sortOrder,
        }));
        onReady(); // ✅ Notify parent
      } else {
        // Redirect to login page if user is not logged in
        navigate("/login");
        onReady(); // ✅ Notify parent even if redirected
      }
    };
    initializeWithUser();
  }, [userSaved?.id, dispatch, navigate, sortField, sortOrder, onReady]);

  return null;
};

export default AppInitializer;