export { api, pingBackend } from './api';

export { authApi } from './queries';
export type { User, LoginRequest, LoginResponse, MeResponse } from './queries';

export {
  queryKeys,
  useBackendHealth,
  useBackendStatus,
  useMeQuery,
  useOrganizationsQuery,
  useOrganizationQuery,
  useUsersQuery,
  useUserQuery,
  useFacilitiesQuery,
  useFacilityQuery,
} from './queries';

export {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useOnboardingMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateFacilityMutation,
  useUpdateFacilityMutation,
  useDeleteFacilityMutation,
  useApiMutation,
} from './mutations';

export type { OrganizationData, UserData, FacilityData } from './mutations';
