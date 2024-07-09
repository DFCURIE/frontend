import { ref, computed } from 'vue';
import { Organization } from '../types';
import { getOrganizations, createOrganization, updateOrganizationLimit, deleteOrganization } from '../../../services/api';
import { useToast } from 'vuestic-ui';
import { useI18n } from 'vue-i18n';

export function useOrganizations() {
  const { t } = useI18n();
  const { init: notify } = useToast();

  const organizations = ref<Organization[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetch = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await getOrganizations();
      organizations.value = response.data;
    } catch (err: any) {
      console.error('Failed to fetch organizations:', err);
      error.value = err.message || t('organizations.fetchError');
      notify({ color: 'danger', message: error.value });
    } finally {
      isLoading.value = false;
    }
  };

  const add = async (organization: Omit<Organization, 'id'>) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await createOrganization(organization);
      organizations.value.push(response.data);
      notify({ color: 'success', message: t('organizations.addSuccess') });
    } catch (err: any) {
      console.error('Failed to add organization:', err);
      error.value = err.message || t('organizations.addError');
      notify({ color: 'danger', message: error.value });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateLimit = async (id: string, limit: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await updateOrganizationLimit(id, { limit });
      const index = organizations.value.findIndex(org => org.id === id);
      if (index !== -1) {
        organizations.value[index] = { ...organizations.value[index], ...response.data };
      }
      notify({ color: 'success', message: t('organizations.updateSuccess') });
    } catch (err: any) {
      console.error('Failed to update organization limit:', err);
      error.value = err.message || t('organizations.updateError');
      notify({ color: 'danger', message: error.value });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const remove = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      await deleteOrganization(id);
      organizations.value = organizations.value.filter(org => org.id !== id);
      notify({ color: 'success', message: t('organizations.deleteSuccess') });
    } catch (err: any) {
      console.error('Failed to delete organization:', err);
      error.value = err.message || t('organizations.deleteError');
      notify({ color: 'danger', message: error.value });
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    organizations: computed(() => organizations.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    fetch,
    add,
    updateLimit,
    remove,
  };
}