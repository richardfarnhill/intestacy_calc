import unittest
from estate_distribution import determine_estate_distribution

class TestEstateDistribution(unittest.TestCase):
    """Test cases for estate distribution calculation."""

    def setUp(self):
        """Set up common test data."""
        self.default_state = {
            "married": False,
            "children": False,
            "parents_alive": False,
            "siblings": False,
            "grandparents": False,
            "aunts_uncles": False
        }

    def test_spouse_only(self):
        """Test estate distribution when only spouse is alive."""
        state = self.default_state.copy()
        state["married"] = True
        estate_value = 500000
        _, result = determine_estate_distribution(state, estate_value)
        self.assertIn(
            "Your entire estate of £500,000.00 will pass to your spouse/civil partner",
            result.value,
            "Failed to correctly distribute estate to spouse only"
        )

    def test_spouse_and_children_small_estate(self):
        """Test estate distribution between spouse and children for estate under £322,000."""
        state = self.default_state.copy()
        state["married"] = True
        state["children"] = True
        estate_value = 300000
        _, result = determine_estate_distribution(state, estate_value)
        self.assertIn(
            "Your spouse/civil partner will receive: £300,000.00",
            result.value,
            "Failed to correctly allocate entire small estate to spouse"
        )

    def test_spouse_and_children_large_estate(self):
        """Test estate distribution between spouse and children for estate over £322,000."""
        state = self.default_state.copy()
        state["married"] = True
        state["children"] = True
        estate_value = 522000  # £200,000 over threshold
        _, result = determine_estate_distribution(state, estate_value)
        self.assertIn(
            "Your spouse/civil partner will receive: £422,000.00",  # £322,000 + (200,000/2)
            result.value,
            "Failed to correctly allocate spouse portion for large estate"
        )
        self.assertIn(
            "Your children will share equally: £100,000.00",  # 200,000/2
            result.value,
            "Failed to correctly allocate children portion for large estate"
        )

    def test_spouse_and_children(self):
        """Test estate distribution between spouse and children."""
        state = self.default_state.copy()
        state["married"] = True
        state["children"] = True
        estate_value = 500000
        _, result = determine_estate_distribution(state, estate_value)
        self.assertIn(
            "Your spouse/civil partner will receive: £322,000.00",
            result.value,
            "Failed to correctly allocate spouse portion"
        )
        self.assertIn(
            "Your children will share equally: £178,000.00",
            result.value,
            "Failed to correctly allocate children portion"
        )

    def test_children_only(self):
        """Test estate distribution when only children are alive."""
        state = self.default_state.copy()
        state["children"] = True
        estate_value = 500000
        _, result = determine_estate_distribution(state, estate_value)
        self.assertIn(
            "Your entire estate of £500,000.00 will be divided equally between your children",
            result.value,
            "Failed to correctly distribute estate to children only"
        )

    def test_parents_only(self):
        """Test estate distribution when only parents are alive."""
        state = self.default_state.copy()
        state["parents_alive"] = True
        estate_value = 500000
        _, result = determine_estate_distribution(state, estate_value)
        self.assertIn(
            "Your entire estate of £500,000.00 will pass to your surviving parent(s) in equal shares",
            result.value,
            "Failed to correctly distribute estate to parents only"
        )

    def test_siblings_only(self):
        """Test estate distribution when only siblings are alive."""
        state = self.default_state.copy()
        state["siblings"] = True
        estate_value = 500000
        _, result = determine_estate_distribution(state, estate_value)
        self.assertIn(
            "Your entire estate of £500,000.00 will be divided equally between your siblings (or their children)",
            result.value,
            "Failed to correctly distribute estate to siblings only"
        )

    def test_grandparents_only(self):
        """Test estate distribution when only grandparents are alive."""
        state = self.default_state.copy()
        state["grandparents"] = True
        estate_value = 500000
        _, result = determine_estate_distribution(state, estate_value)
        self.assertIn(
            "Your entire estate of £500,000.00 will pass to your surviving grandparents in equal shares",
            result.value,
            "Failed to correctly distribute estate to grandparents only"
        )

    def test_aunts_uncles_only(self):
        """Test estate distribution when only aunts/uncles are alive."""
        state = self.default_state.copy()
        state["aunts_uncles"] = True
        estate_value = 500000
        _, result = determine_estate_distribution(state, estate_value)
        self.assertIn(
            "Your entire estate of £500,000.00 will be divided equally between your aunts/uncles (or their children)",
            result.value,
            "Failed to correctly distribute estate to aunts/uncles only"
        )

    def test_no_relatives(self):
        """Test estate distribution when no eligible relatives exist."""
        estate_value = 500000
        _, result = determine_estate_distribution(self.default_state, estate_value)
        self.assertIn(
            "Your estate will pass to the Crown (Bona Vacantia)",
            result.value,
            "Failed to correctly handle case with no eligible relatives"
        )

if __name__ == '__main__':
    unittest.main()
