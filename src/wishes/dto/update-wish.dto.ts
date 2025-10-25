import { IsString, IsOptional, IsEnum, IsBoolean } from "class-validator";

// Возможные приоритеты желания
export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

// DTO для обновления желания
export class UpdateWishDto {
  @IsOptional()
  @IsString({ message: "Название должно быть строкой" })
  title?: string;

  @IsOptional()
  @IsString({ message: "Описание должно быть строкой" })
  description?: string;

  @IsOptional()
  @IsString({ message: "Ссылка должна быть строкой" })
  link?: string;

  @IsOptional()
  @IsEnum(Priority, { message: "Приоритет должен быть одним из: LOW, MEDIUM, HIGH" })
  priority?: Priority;

  @IsOptional()
  @IsBoolean({ message: "Статус выполнения должен быть булевым значением" })
  completed?: boolean;
}
