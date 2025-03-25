import { Category } from "./category";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: boolean;
    priority: number;
    dueDate: Date | string;
    categoryId: number;
    category: Category | null;
}

export function createNewTask(): Task {
    return {
        id: 0,
        title: "",
        description: "",
        status: false,
        priority: 0,
        dueDate: "",
        categoryId: 0,
        category: null
    };
} 