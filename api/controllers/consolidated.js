import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// Auth Controllers
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Wrong password or username!" });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, JWT_SECRET);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      })
      .status(200)
      .json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .status(200)
    .json({ message: "User has been logged out!" });
};

// User Controllers
export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const savePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.userId;

    const existingSave = await prisma.savedPost.findFirst({
      where: {
        userId,
        postId,
      },
    });

    if (existingSave) {
      await prisma.savedPost.delete({
        where: {
          id: existingSave.id,
        },
      });
      return res.status(200).json({ message: "Post unsaved successfully!" });
    }

    await prisma.savedPost.create({
      data: {
        userId,
        postId,
      },
    });

    res.status(201).json({ message: "Post saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Post Controllers
export const getPosts = async (req, res) => {
  try {
    const { type, city, property, minPrice, maxPrice, bedroom } = req.query;

    const filters = {};

    if (type) filters.type = type;
    if (city) filters.city = { contains: city, mode: "insensitive" };
    if (property) filters.property = property;
    if (bedroom) filters.bedroom = parseInt(bedroom);
    if (minPrice && maxPrice) {
      filters.price = {
        gte: parseInt(minPrice),
        lte: parseInt(maxPrice),
      };
    } else if (minPrice) {
      filters.price = {
        gte: parseInt(minPrice),
      };
    } else if (maxPrice) {
      filters.price = {
        lte: parseInt(maxPrice),
      };
    }

    const posts = await prisma.post.findMany({
      where: filters,
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        postDetail: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    let isSaved = false;

    if (userId) {
      const savedPost = await prisma.savedPost.findFirst({
        where: {
          userId,
          postId: id,
        },
      });

      if (savedPost) isSaved = true;
    }

    res.status(200).json({ ...post, isSaved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, price, images, address, city, bedroom, bathroom, latitude, longitude, type, property, desc, utilities, pet, income, size, school, bus, restaurant } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        price: parseInt(price),
        images,
        address,
        city,
        bedroom: parseInt(bedroom),
        bathroom: parseInt(bathroom),
        latitude,
        longitude,
        type,
        property,
        userId: req.userId,
        postDetail: {
          create: {
            desc,
            utilities,
            pet,
            income,
            size: parseInt(size),
            school: parseInt(school),
            bus: parseInt(bus),
            restaurant: parseInt(restaurant),
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Chat Controllers
export const getChats = async (req, res) => {
  try {
    const userId = req.userId;

    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          has: userId,
        },
      },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.userId;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot chat with yourself!" });
    }

    // Check if chat already exists
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            userIDs: {
              has: senderId,
            },
          },
          {
            userIDs: {
              has: receiverId,
            },
          },
        ],
      },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // Create new chat
    const newChat = await prisma.chat.create({
      data: {
        users: {
          connect: [
            { id: senderId },
            { id: receiverId },
          ],
        },
        userIDs: [senderId, receiverId],
        seenBy: [senderId],
      },
    });

    res.status(201).json(newChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Message Controllers
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.userId;

    // Check if user is part of the chat
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat || !chat.userIDs.includes(userId)) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    // Mark chat as seen
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          push: userId,
        },
      },
    });

    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { chatId, text } = req.body;
    const userId = req.userId;

    // Check if user is part of the chat
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat || !chat.userIDs.includes(userId)) {
      return res.status(403).json({ message: "Not authorized!" });
    }

    // Create message
    const newMessage = await prisma.message.create({
      data: {
        text,
        userId,
        chatId,
      },
    });

    // Update chat with last message
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessage: text,
        seenBy: [userId],
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};