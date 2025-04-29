import { Button } from "@/components/ui/button"
import { RefreshCw } from 'lucide-react'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

interface ErrorAlertProps {
    title?: string
    description?: string
    onRetry?: () => void
}

export function ErrorAlert(
    { title = "Hubo un problema al cargar los datos",
        description = "No se pudieron cargar los datos debido a restricciones. Por favor, espera unos momentos antes de intentar nuevamente.",
        onRetry
    }: ErrorAlertProps) {
    return (
            <Alert className="shadow-md max-w-md mx-auto p-8 ">
                <AlertTitle className="font-medium text-xl mb-2">{title}</AlertTitle>
                <AlertDescription className="flex flex-col items-center">
                    <p className="mb-4">{description}</p>
                    {onRetry && (
                        <Button size="sm"
                            onClick={onRetry}
                            className="mt-2 group"
                        >
                            <RefreshCw className="mr-2 h-4 w-4 group-hover:animate-spin" />
                            Intentar nuevamente
                        </Button>
                    )}
                </AlertDescription>
            </Alert>
    )
}
