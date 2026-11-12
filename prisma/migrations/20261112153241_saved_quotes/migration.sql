-- CreateTable
CREATE TABLE "SavedQuote" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "term" INTEGER NOT NULL,
    "service" TEXT NOT NULL,
    "listCents" INTEGER NOT NULL,
    "volumePercent" INTEGER NOT NULL,
    "volumeDiscountCents" INTEGER NOT NULL,
    "termPercent" INTEGER NOT NULL,
    "termDiscountCents" INTEGER NOT NULL,
    "maintenanceCents" INTEGER NOT NULL,
    "monthlyCents" INTEGER NOT NULL,
    "totalCents" BIGINT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedQuote_pkey" PRIMARY KEY ("id")
);
