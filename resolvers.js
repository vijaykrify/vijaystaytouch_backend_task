const {
    getToken,
    encryptPassword,
    comparePassword,
    getPayload
} = require("./utils")
const Student = require('./models/student').Students;
const User = require('./models/user').Users;
const resolvers = {
    Query: {

        //get student by id

        getStudent: async (parent, args, context) => {
            const isLogged = getPayload(context.token);
            if (!isLogged.loggedIn)
                return {
                    error: "Invalid token"
                }
            return (await Student.findById(args.id));
        },


        //get students by search and pagination

        getStudents: async (parent, args, context) => {
            const isLogged = getPayload(context.token);
            if (!isLogged.loggedIn)
                return {
                    error: "Invalid token"
                }

            // destrcture search, page, limit, and set default values

            const {
                search = null, page = 1, limit = 20
            } = args;

            let searchQuery = {};

            // run if search is provided

            if (search) {
                // update the search query

                searchQuery = {
                    $or: [{
                            first_name: {
                                $regex: search,
                                $options: 'i'
                            }
                        },
                        {
                            last_name: {
                                $regex: search,
                                $options: 'i'
                            }
                        },
                        {
                            email: {
                                $regex: search,
                                $options: 'i'
                            }
                        }
                    ]
                };
            }

            // execute query to search users

            const users = await Student.find(searchQuery)

            // get total users

            const count = await Student.countDocuments(searchQuery);
            return {
                students: users,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            }
        }


    },

    Mutation: {

        //login user

        login: async (parent, args) => {
            const user = await User.findOne({
                username: args.username
            });
            const isMatch = await comparePassword(args.password, user.password)
            if (isMatch) {

                const token = getToken(user)
                return {
                    ...user,
                    token
                };
            } else {
                return {
                    error: "Wrong Password Or Username"
                }
            }
        },

        //register user

        register: async (parent, args) => {
            let newUser = new User({
                username: args.username,
                password: await encryptPassword(args.password)
            })
            const user = await User.findOne({
                username: args.username
            })
            if (user) {
                return {
                    error: "User Already Exists!"
                }
            }
            try {
                const regUser = (await newUser.save(newUser).then(result => {
                    return result;
                }))

                const token = getToken(regUser);
                return {
                    ...regUser,
                    token
                };
            } catch (e) {
                throw e
            }
        },

        //add student

        addStudent: (parent, args, context) => {
            const isLogged = getPayload(context.token);
            if (!isLogged.loggedIn)
                //   throw new Error("Invalid token")
                return {
                    error: "Invalid token"
                }
            //email validation
            let emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            const isValidEmail = emailExpression.test(String(args.email).toLowerCase())
            if (!isValidEmail)
                return {
                    error: "please enter a valid email"
                }


            //time validation
            const timeExpression = /^(\d{2})\-(\d{2})\-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
            const isValidTime = timeExpression.test(String(args.meeting_time))
            if (!isValidTime)
                return {
                    error: "please enter a valid meeting_time"
                }

            let student = new Student({
                first_name: args.first_name,
                last_name: args.last_name,
                email: args.email,
                phone: args.phone,
                address: args.address,
                meeting_time: args.meeting_time
            });
            return student.save();
        },

        //update student

        updateStudent: (parent, args, context) => {
            if (!args.id) return;
            const isLogged = getPayload(context.token);
            if (!isLogged.loggedIn)
                return {
                    error: "Invalid token"
                }
            //email validation
            let emailExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const isValidEmail = emailExpression.test(String(args.email).toLowerCase())
            if (typeof args.email !== "undefined" && !isValidEmail)
                //   throw new Error("please enter a valid email")
                return {
                    error: "please enter a valid email"
                }

            //time validation
            const timeExpression = /^(\d{2})\-(\d{2})\-(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
            const isValidTime = timeExpression.test(String(args.meeting_time))
            if (typeof args.time !== "undefined" && !isValidTime)
                return {
                    error: "please enter a valid meeting_time"
                }

            return Student.findOneAndUpdate({
                _id: args.id
            }, {
                $set: {
                    first_name: args.first_name,
                    last_name: args.last_name,
                    email: args.email,
                    phone: args.phone,
                    address: args.address,
                    meeting_time: args.meeting_time
                }
            }, {
                new: true
            }).then(result => {
                return {
                    student: result,
                    data: "Student data updated successfully"
                }
            });
        },

        //delete student

        deleteStudent: (parent, args, context) => {
            if (!args.id) return;
            const isLogged = getPayload(context.token);
            if (!isLogged.loggedIn)
                return {
                    error: "Invalid token"
                }
            return Student.findOneAndDelete({
                _id: args.id
            }).then(result => {
                return {
                    student: result,
                    data: "Student data deleted successfully"
                }
            })
        },



    }
}
module.exports = resolvers