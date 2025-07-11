import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AccountSetup from '@/pages/AccountSetup';
import FacilitySetup from '@/pages/FacilitySetup';
import OrganizationDashboard from '@/pages/OrganizationDashboard';
import FacilityDashboard from '@/pages/FacilityDashboard';
import People from '@/pages/People';
import Training from '@/pages/Training';
import TrainingOverview from '@/pages/TrainingOverview';
import TrainingCourseDetail from '@/pages/TrainingCourseDetail';
import BookTraining from '@/pages/BookTraining';
import ExerciseOverview from '@/pages/ExerciseOverview';
import ExerciseDetail from '@/pages/ExerciseDetail';
import CreateExercise from '@/pages/CreateExercise';
import ExerciseReview from '@/pages/ExerciseReview';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { ProtectedRoute, MasterOnly } from '@/components/ProtectedRoute';
import MasterAdmin from '@/pages/MasterAdmin';
import Login from '@/pages/Login';
import { AuthProvider } from '@/contexts/AuthContext';
import AcceptInvite from '@/pages/AcceptInvite';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentFailed from '@/pages/PaymentFailed';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Toaster />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/facility-setup" element={<FacilitySetup />} />
                <Route path="/account-setup" element={<AccountSetup />} />
                <Route
                  path="/people"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <People />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organization-dashboard"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <OrganizationDashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/master-admin"
                  element={
                    <MasterOnly>
                      <MasterAdmin />
                    </MasterOnly>
                  }
                />
                <Route
                  path="/facility/:facilityId"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <FacilityDashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/training"
                  element={
                    <Layout>
                      <Training />
                    </Layout>
                  }
                />
                <Route
                  path="/training-overview"
                  element={
                    <Layout>
                      <TrainingOverview />
                    </Layout>
                  }
                />
                <Route
                  path="/training-course/:facilityId/:courseId"
                  element={
                    <Layout>
                      <TrainingCourseDetail />
                    </Layout>
                  }
                />
                <Route
                  path="/book-training/:facilityId"
                  element={
                    <Layout>
                      <BookTraining />
                    </Layout>
                  }
                />
                <Route
                  path="/exercise-overview"
                  element={
                    <Layout>
                      <ExerciseOverview />
                    </Layout>
                  }
                />
                <Route
                  path="/exercise-detail/:facilityId/:exerciseId"
                  element={
                    <Layout>
                      <ExerciseDetail />
                    </Layout>
                  }
                />
                <Route
                  path="/create-exercise/:facilityId"
                  element={
                    <Layout>
                      <CreateExercise />
                    </Layout>
                  }
                />
                <Route
                  path="/exercise-review/:facilityId/:exerciseId"
                  element={
                    <Layout>
                      <ExerciseReview />
                    </Layout>
                  }
                />
                <Route
                  path="/exercises"
                  element={
                    <Layout>
                      <ExerciseOverview />
                    </Layout>
                  }
                />
                <Route path="/accept-invite" element={<AcceptInvite />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />
                <Route path="/" element={<Login />} />
              </Routes>
            </div>
          </AuthProvider>
        </AppProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
