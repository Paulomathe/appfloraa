import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

type ProfileInfoProps = {
  name: string;
  email: string;
  avatarUrl?: string | null;
};

export const ProfileInfo = ({ name, email }: ProfileInfoProps) => {
  return (
    <View style={styles.container}>
      {/* Avatar removido */}
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
  info: {
    // marginLeft removido pois não há mais avatar
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