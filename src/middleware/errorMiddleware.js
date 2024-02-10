export default function errorMiddleware(error, req, res, next) {
  console.log("\x1b[33m%s\x1b[0m", error);
  res.status(error.statusCode).send({
    message: error.message,
  });
}
