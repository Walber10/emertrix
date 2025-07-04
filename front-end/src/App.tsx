import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import AccountSetup from '@/pages/AccountSetup';
import PlanSelection from '@/pages/PlanSelection';
import CreateFacility from '@/pages/CreateFacility';
import FacilitySetup from '@/pages/FacilitySetup';
import OrganizationDashboard from '@/pages/OrganizationDashboard';
import FacilityDashboard from '@/pages/FacilityDashboard';
import People from '@/pages/People';
import EmergencyPlan from '@/pages/EmergencyPlan';
import EmergencyPlanSetup from '@/pages/EmergencyPlanSetup';
import RiskAssessmentSetup from '@/pages/RiskAssessmentSetup';
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Toaster />
            <Routes>
              <Route path="/account-setup" element={<AccountSetup />} />
              <Route path="/facility-setup" element={<FacilitySetup />} />
              <Route path="/create-facility" element={<CreateFacility />} />
              <Route
                path="/people"
                element={
                  <Layout>
                    <People />
                  </Layout>
                }
              />
              <Route
                path="/organization-dashboard"
                element={
                  <Layout>
                    <OrganizationDashboard />
                  </Layout>
                }
              />
              <Route
                path="/facility/:facilityId"
                element={
                  <Layout>
                    <FacilityDashboard />
                  </Layout>
                }
              />
              <Route
                path="/emergency-plan"
                element={
                  <Layout>
                    <EmergencyPlan />
                  </Layout>
                }
              />
              <Route
                path="/emergency-plan-setup"
                element={
                  <Layout>
                    <EmergencyPlanSetup />
                  </Layout>
                }
              />
              <Route
                path="/risk-assessment-setup"
                element={
                  <Layout>
                    <RiskAssessmentSetup />
                  </Layout>
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
              <Route path="/" element={<AccountSetup />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
