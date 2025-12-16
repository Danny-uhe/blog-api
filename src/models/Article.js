import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    tags: [String],

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⭐ NEW ANALYTICS FIELDS
    views: {
      type: Number,
      default: 0,
    },

    viewsByDay: [
      {
        day: { type: Date }, // Only the date (no time)
        count: { type: Number, default: 0 },
      },
    ],
  },

  { timestamps: true }
);

articleSchema.index({
  title: "text",
  content: "text",
  tags: "text",
});

export const Article = mongoose.model("Article", articleSchema);














// import mongoose  from "mongoose";

// const articleSchema = new mongoose.Schema(
//     {
//         title:{
//         type: String,
//         required: true,
//     },

//     content: {
//         type: String,
//         required: true,
//     },

//     image: {
//         type: String,
//         default: null,
//     },

//     likes: [{
//         type: mongoose.Schema.Types.ObjectId, ref: "User"
//     }],

//     tags: [String],
//     publishedAt: {
//         type: Date,
//         default: Date.now,
//        },
//        author : {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//        },
//     },


//     {timestamps: true}
    
// );

// articleSchema.index({
//   title: "text",
//   content: "text",
//   tags: "text"
// });


// export const Article = mongoose.model("Article", articleSchema);