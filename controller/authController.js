const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
var SibApiV3Sdk = require('sib-api-v3-sdk');

const AppError = require("../utils/appError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Email = require("../utils/email");
const Cart = require("../models/cartModel");

const signToken = (user) => {
  const { name, role, email, _id: id } = user;
  return jwt.sign(
    {
      id,
      name,
      role,
      email,
    },
    // this jwt secret should  be greater then 32 alphabets
    process.env.JWT_SECRET,
    {
      // this can be 90d ,30h,50m ,20s
      expiresIn: process.env.JWT_EXPIRE_IN,
    }
  );
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  const cookieOptions = {
    expires: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  // if (process.env.NODE_ENV == "production") {
  //   cookieOptions.secure = true;
  // }
  // cookieOptions.secure = true;
  // name of the cookie jwt
  // cookie data is token
  // cookie properties are cookieOptions
  // res.cookie('jwt', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
  res.cookie("jwt", token, cookieOptions);
  // res.cookie('name',"abdulrehman",cookieOptions)
  // removing new created user password
  user.password = undefined;
  res.header('x-token', token);
  res.header('access-control-expose-headers', 'x-token')
  // if (app.locals)  app.locals.user = user;
  // res.locals.user=user;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await User.create({
    role: req.body.role,
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    contactNo:req.body.contactNo
  });
  const cart=await Cart.create({customer:newUser._id});
  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;
  console.log({body:req.body});
  if (!name || !password)
    return next(new AppError("please enter complete detail", 403));
  const user = await User.findOne({ name }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect username or password", 403));
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1 ) check the token have user
  if (req.headers["x-token"] ) {
    token = req.headers["x-token"];
    // console.log({newToken:token});
  } 
//   else if (
//     req.headers.authorization
//     //  &&
//     // req.headers.authorization.startsWith("Bearer")
//   ) {
//     // token = req.headers.authorization.split(" ")[1];
//     token=req.headers.authorization.substr(4);
//     console.log({mytoken:token});
// }
  //  else if (req.headers.cookie) {
  //   // console.log({cookie:req.headers.cookie});
  //   // console.log({subcookie:req.headers.cookie.substr(4)});
  //   token =   req.headers.cookie.substr(4);
  // } 
  else {
    return next(
      new AppError("You are not login please login anb get access", 401)
    );
  }
  // console.log(req.cookies.jwt);
  // console.log(req.headers.authorization);
  // 2) verification of token
  // console.log("Protector");
  // console.log(token);
  // console.log("Protector");
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
  // if verification if pass then decoded value  like below
  // decoded={
  //   id: '5f08ac1c6aa46f0df451d8db',
  //   iat: 1594403926,
  //   exp: 1598291926
  //  }
  // 3) check user still exist not delete
  // console.log("current user");
  // console.log(decoded);
  // console.log("current user");
  let currentUser = await User.findOne({name:decoded.name});
  if (!currentUser)
    return next(
      new AppError("No user belong to this token please try again", 401)
    );
  // 4) check if user change the password after generating token
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently change password please login again", 401)
    );
  }
  // Access granted to the next rout
  // see blew function where req.user used
  req.user = currentUser;
  // res.locals.user = currentUser;
  next();
});
exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      next(new AppError("You do not  have permission to do this action", 403));
    }
    next();
  };
};
exports.logout = (req, res) => {
  res.cookie("jwt", "logging out", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user = await User.findById(req.user._id).select("+password");
  if (
    !user ||
    !(await user.correctPassword(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError("Incorrect password ...!!!", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  req.user=user;
  createAndSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    active: true,
  });
  if (!user) {
    return next(new AppError("There is no user with that email ..!!!", 401));
  }
  // 2)  create new random  token for reset password
  const resetToken = user.createResetPasswordToken();
  // Nobody know every thing
  // this is tour off user model validator
  await user.save({
    validator: false,
  });
  // 3) Send it to user's email
  // try {
  //   const resetURL = `${process.env.FRONT_URL}/resetPassword/${resetToken}`;
  //   await new Email(user, resetURL).sendPasswordReset();
  //   // send response to user
  //   res.status(200).json({
  //     status: "success",
  //     message: "Token sent to email!",
  //   });
  // } catch (err) {
  //   user.passwordResetToken = undefined;
  //   user.passwordResetExpires = undefined;
  //   await user.save({ validateBeforeSave: false });
  //   console.log(err);
  //   return next(
  //     new AppError("There was an error sending the email. Try again later!"),
  //     500
  //   );
  // }
var defaultClient = SibApiV3Sdk.ApiClient.instance;
// Configure API key authorization: api-key
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';
// Uncomment below two lines to configure authorization using: partner-key
// var partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = 'YOUR API KEY';
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
sendSmtpEmail = {
    to: [{
        email: '18251598-126@uog.edu.pk',
        name: 'ABDULREHMAN'
    }],
    templateId: 59,
    params: {
        name: 'ABDUL',
        surname: 'REHMAN'
    },
    headers: {
        'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
    }
};
apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});
res.status(200).json({
  status:"Success",
  message:"email sent successfully!!!"
})
});
// RESET PASSWORD MODULES
exports.resetPassword = catchAsync(async (req, res, next) => {
  // // Get user based on token
  // console.log(req.body);
  // console.log(req.params.token);
  // const hashedPass = Crypto
  //   .createHash("sha256")
  //   .update(req.params.token)
  //   .digest("hex");
  // check the user is valid and not expired
  let user;
  user = await User.findOne({
    // passwordResetToken: hashedPass,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired"));
  }
  // There is token is not expires and there is user set new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({
    validator: true,
  });
  req.user=user;
  createAndSendToken(user, 200, res);
  // update changePasswordAt property for user
  // login the user with JWT
});
