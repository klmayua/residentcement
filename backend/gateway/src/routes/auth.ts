import { Router, Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { generateToken } from "../middleware/auth";
import logger from "../utils/logger";

const authLogger = logger;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
  phone: z.string().min(10),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = loginSchema.parse(req.body);
    logger.info({ email: body.email, action: "login" });

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: {
        customer: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(body.password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "Account is disabled",
      });
    }

    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.customer?.companyName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        errors: error.errors,
      });
    }
    logger.error({ error });
    res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Login failed",
    });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const body = registerSchema.parse(req.body);
    logger.info({ email: body.email, action: "register" });

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return res.status(400).json({
        code: "CONFLICT",
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        role: "DISTRIBUTOR",
        customer: {
          create: {
            companyName: body.companyName,
            address: body.address,
            city: body.city,
            state: body.state,
            phone: body.phone,
          },
        },
      },
      include: {
        customer: true,
      },
    });

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      userId: user.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        errors: error.errors,
      });
    }
    logger.error({ error });
    res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Registration failed",
    });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Refresh token required",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        sessions: {
          some: { token: refreshToken },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Invalid refresh token",
      });
    }

    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({ token });
  } catch (error) {
    logger.error({ error });
    res.status(500).json({ code: "INTERNAL_ERROR", message: "Token refresh failed" });
  }
});

router.post("/logout", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.substring(7);
    await prisma.session.deleteMany({
      where: { token },
    }).catch(() => {});
  }
  res.json({ message: "Logged out successfully" });
});

router.get("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  try {
    const token = authHeader.substring(7);
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Session expired",
      });
    }

    const user = session.user;
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.customer?.companyName,
      role: user.role,
      phone: user.phone,
    });
  } catch (error) {
    logger.error({ error });
    res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Invalid token",
    });
  }
});

export { router as authRouter };
