-- CreateTable
CREATE TABLE "_BookingToTimeSlot" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookingToTimeSlot_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BookingToTimeSlot_B_index" ON "_BookingToTimeSlot"("B");

-- AddForeignKey
ALTER TABLE "_BookingToTimeSlot" ADD CONSTRAINT "_BookingToTimeSlot_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingToTimeSlot" ADD CONSTRAINT "_BookingToTimeSlot_B_fkey" FOREIGN KEY ("B") REFERENCES "TimeSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
