const Guest = require("../models/guest.model");

const Room = require("../models/room.model");

const Booking = require("../models/booking.model");

const Feedback = require("../models/feedback.model");

const Service = require("../models/service.model");

const Maintenance =
  require("../models/maintenance.model");

const Billing = require("../models/billing.model");



// CONSUMED ---
// ======================================================
// GET DASHBOARD CARDS
// ======================================================

exports.getDashboardCards =
  async (req, res, next) => {

    try {

      // ======================================================
      // TOTAL COUNTS
      // ======================================================

      const totalGuests =
        await Guest.countDocuments();

      const totalRooms =
        await Room.countDocuments();

      const totalBookings =
        await Booking.countDocuments();

      const totalFeedbacks =
        await Feedback.countDocuments();

      const totalMaintenanceRequests =
        await Maintenance.countDocuments();


      const totalServices =
        await Service.countDocuments();

      // ======================================================
      // TOTAL REVENUE (PAID ONLY)
      // ======================================================

      const revenueResult =
        await Billing.aggregate([

          {
            $match: {
              paymentStatus: "paid"
            }
          },

          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: "$totalAmount"
              }
            }
          }
        ]);

      const totalRevenue =
        revenueResult[0]?.totalRevenue || 0;




      // ======================================================
      // OCCUPANCY RATE
      // ======================================================

      const occupiedRooms =
        await Room.countDocuments({
          status: "occupied"
        });

      const occupancyRate =
        totalRooms > 0
          ? (
            (occupiedRooms / totalRooms) * 100
          ).toFixed(2)
          : 0;




      // ======================================================
      // MOST BOOKED ROOM TYPE
      // ======================================================

      const mostBookedRoomTypeResult =
        await Booking.aggregate([

          {
            $lookup: {
              from: "rooms",
              localField: "room",
              foreignField: "_id",
              as: "roomData"
            }
          },

          {
            $unwind: "$roomData"
          },

          {
            $group: {

              _id: "$roomData.roomType",

              totalBookings: {
                $sum: 1
              }
            }
          },

          {
            $sort: {
              totalBookings: -1
            }
          },

          {
            $limit: 1
          }
        ]);

      const mostBookedRoomType =
        mostBookedRoomTypeResult[0] || null;




      // ======================================================
      // TOP SERVICES
      // ======================================================

      const topServices =
        await Booking.aggregate([

          {
            $unwind: "$services"
          },

          {
            $group: {

              _id: "$services.name",

              totalRequests: {
                $sum: 1
              }
            }
          },

          {
            $sort: {
              totalRequests: -1
            }
          },

          {
            $limit: 5
          }
        ]);




      // ======================================================
      // MONTHLY REVENUE
      // ======================================================

      const monthlyRevenue =
        await Billing.aggregate([

          {
            $match: {
              paymentStatus: "paid"
            }
          },

          {
            $group: {

              _id: {

                month: {
                  $month: "$paidAt"
                },

                year: {
                  $year: "$paidAt"
                }
              },

              revenue: {
                $sum: "$totalAmount"
              }
            }
          },

          {
            $sort: {
              "_id.year": 1,
              "_id.month": 1
            }
          }
        ]);




      // ======================================================
      // RESPONSE
      // ======================================================

      res.status(200).json({

        success: true,

        dashboard: {

          totalGuests,

          totalRevenue,

          totalRooms,

          totalServices,

          occupancyRate,

          totalBookings,

          totalFeedbacks,

          totalMaintenanceRequests,

          mostBookedRoomType,

          topServices,

          monthlyRevenue
        }
      });

    } catch (error) {

      next(error);

    }

  };