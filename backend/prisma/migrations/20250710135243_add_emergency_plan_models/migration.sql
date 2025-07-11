-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "description" TEXT,
ADD COLUMN     "stripe_payment_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "currency" SET DEFAULT 'AUD';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_plans" (
    "id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "approvalDate" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emergency_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_plan_steps" (
    "id" TEXT NOT NULL,
    "emergency_plan_id" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emergency_plan_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_plan_role_assignments" (
    "id" TEXT NOT NULL,
    "emergency_plan_id" TEXT NOT NULL,
    "stepType" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,
    "user_id" TEXT,
    "observerName" TEXT,
    "trained" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emergency_plan_role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emergency_plans_facility_id_version_key" ON "emergency_plans"("facility_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_plan_steps_emergency_plan_id_stepType_key" ON "emergency_plan_steps"("emergency_plan_id", "stepType");

-- CreateIndex
CREATE INDEX "facility_accesses_facility_id_idx" ON "facility_accesses"("facility_id");

-- CreateIndex
CREATE INDEX "facility_accesses_user_id_idx" ON "facility_accesses"("user_id");

-- CreateIndex
CREATE INDEX "payments_organization_id_idx" ON "payments"("organization_id");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organization_id_idx" ON "users"("organization_id");

-- AddForeignKey
ALTER TABLE "facility_accesses" ADD CONSTRAINT "facility_accesses_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_plans" ADD CONSTRAINT "emergency_plans_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_plan_steps" ADD CONSTRAINT "emergency_plan_steps_emergency_plan_id_fkey" FOREIGN KEY ("emergency_plan_id") REFERENCES "emergency_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_plan_role_assignments" ADD CONSTRAINT "emergency_plan_role_assignments_emergency_plan_id_fkey" FOREIGN KEY ("emergency_plan_id") REFERENCES "emergency_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_plan_role_assignments" ADD CONSTRAINT "emergency_plan_role_assignments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
