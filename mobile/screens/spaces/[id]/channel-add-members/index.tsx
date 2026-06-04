import { router } from 'expo-router';
import React, { memo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import SafeHorizontalView from '@/components/safe-horizontal-view';
import ScreenHeader from '@/components/screen-header';
import ScreenWrapper from '@/components/screen-wrapper';
import {
  ISearchUserData,
  SearchAndAddUser,
  SearchAndAddUserProps,
} from '@/components/search-and-add-user';
import { colors } from '@/constants/colors';
import { SpaceService, useAddSpaceMembers } from '@/services';
import { ApiError } from '@/utils/http/api-error';

const SearchAndAddUserMemoized = memo(SearchAndAddUser);

const ChannelAddMembers = ({ spaceId }: { spaceId: string }) => {
  const [selectedMembers, setSelectedMembers] = useState<ISearchUserData[]>([]);

  const { mutateAsync: addMembers, isPending } = useAddSpaceMembers();

  const handleAddMembers = async () => {
    try {
      await addMembers({
        spaceId: spaceId,
        variables: {
          users: selectedMembers.map((member) => member.id),
        },
      });

      router.back();
    } catch (error) {
      if (ApiError.isApiError(error)) {
        if (error.error.code === 'USERS_ALREADY_MEMBERS') {
          Alert.alert(
            'Erro',
            'Os utilizadores já são membros do espaço\n\n Os utilizadores já são membros do espaço'
          );
        }
      }
    }
  };

  const onSelectUser: SearchAndAddUserProps['onSelect'] = (members) => {
    setSelectedMembers(members);
  };

  const handleSearch: SearchAndAddUserProps['onSearch'] = async (search: string) => {
    const response = await SpaceService.findSpaceCandidateMembers(spaceId, { username: search });
    return response.data.map((user) => ({
      id: user.id,
      title: user.username,
    }));
  };

  return (
    <ScreenWrapper
      style={styles.container}
      backgroundColor={colors.greyMedium}
      scrollable={false}
      safeArea={false}
      bottomSafeArea={true}
    >
      <ScreenHeader
        type="back"
        title="Adicionar membro"
        onClose={() => router.back()}
        iconContainerColor={colors.greyLight}
      />

      <SearchAndAddUserMemoized
        id={spaceId}
        onSearch={handleSearch}
        onSelect={onSelectUser}
        style={styles.searchAndAddUser}
      />

      <View style={styles.button}>
        <SafeHorizontalView>
          <Button.Root
            disabled={selectedMembers.length === 0}
            onPress={handleAddMembers}
            loading={isPending}
          >
            Adicionar
          </Button.Root>
        </SafeHorizontalView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchAndAddUser: {
    flexGrow: 9,

    paddingTop: 16,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});

export default ChannelAddMembers;
