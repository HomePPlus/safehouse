import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const Input = ({ 
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    style,
    editable = true,
}) => {
    return (
        <TextInput
            style={[styles.input, style]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            placeholderTextColor="#999"
            editable={editable}
    />
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
});

export default Input;