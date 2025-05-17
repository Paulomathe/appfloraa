import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '@/constants/colors';
import { profileImages } from '@/assets';

type ProfileInfoProps = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export const ProfileInfo = ({ name, email, avatarUrl }: ProfileInfoProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={
          avatarUrl
            ? { uri: avatarUrl }
            : profileImages.default
        }
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    marginLeft: 16,
    flexDirection: 'column',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  email: {
    fontSize: 12,
    color: colors.textLight,
  },
}); 