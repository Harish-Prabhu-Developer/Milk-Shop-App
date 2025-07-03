// CustomInput.tsx
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type CustomInputBoxProps = {
    type?: 'email' | 'password' | 'name' | 'phone';
    iconName?: string;
    keyboardComplete?: TextInputProps['autoComplete'];
    cursorColor?: string;
    iconSize?: number;
    error?: boolean;
    iconColor?: string;
    eyeiconSize?: number;
    eyeiconColor?: string;
    placeholderTextColor?: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
};

const CustomInput: React.FC<CustomInputBoxProps> = ({
    type,
    iconName,
    keyboardComplete,
    cursorColor,
    iconSize = 20,
    error,
    iconColor = '#000',
    eyeiconSize = 20,
    placeholderTextColor = '#000',
    eyeiconColor = '#000',
    placeholder,
    value,
    onChangeText,
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const getKeyboardType = () => {
        switch (type) {
            case 'email':
                return 'email-address';
            case 'phone':
                return 'phone-pad';
            default:
                return 'default';
        }
    };

    const getIcon = () => {
        if (iconName) return iconName;
        switch (type) {
            case 'email':
                return 'envelope';
            case 'password':
                return 'lock';
            case 'name':
                return 'user';
            case 'phone':
                return 'phone';
            default:
                return 'pencil';
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
            <Icon
                name={getIcon()}
                size={iconSize}
                color={iconColor}
                style={{ marginRight: 10 }}
            />
            <TextInput
                key={isPasswordVisible ? 'visible' : 'hidden'} // Force re-render
                style={[styles.input, error && styles.errorInput]}
                placeholder={placeholder}
                value={value}
                placeholderTextColor={placeholderTextColor}
                onChangeText={onChangeText}
                secureTextEntry={type === 'password' && !isPasswordVisible}
                cursorColor={cursorColor}
                autoComplete={keyboardComplete}
                keyboardType={getKeyboardType()}
                autoCorrect={type !== 'email'}
                autoFocus={type === 'name' || type === 'phone'}
                autoCapitalize={type === 'email' ? 'none' : 'words'}
            />
            {type === 'password' && (
                <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Icon
                        name={isPasswordVisible ? 'eye' : 'eye-slash'}
                        size={eyeiconSize}
                        color={eyeiconColor}
                        style={{ marginLeft: 10 }}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: "#D1D5DB", // Tailwind gray-300
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#F8F8F8",
    },
    input: {
        flex: 1,
        color: '#000',
        fontSize: 16,
    },
    errorInput: {
        borderColor: 'red',
    },
});

export default CustomInput;
