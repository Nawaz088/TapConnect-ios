import { Stack } from "expo-router"

const stackLayout = () => {
    return(
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false}} />
            <Stack.Screen name="EditContact" options={{ headerShown: false}} />
            <Stack.Screen name="EditGroup" options={{ headerShown: false}} />
            <Stack.Screen name="NewGroup" options={{ headerShown: false}} />
            <Stack.Screen name="Group" options={{ headerShown: false}} />
            <Stack.Screen name="AddContacts" options={{ headerShown: false}} />
        </Stack>
    )
}

export default stackLayout;