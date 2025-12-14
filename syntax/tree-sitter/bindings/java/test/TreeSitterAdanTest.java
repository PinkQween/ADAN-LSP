import io.github.treesitter.jtreesitter.Language;
import io.github.treesitter.jtreesitter.adan.TreeSitterAdan;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class TreeSitterAdanTest {
    @Test
    public void testCanLoadLanguage() {
        assertDoesNotThrow(() -> new Language(TreeSitterAdan.language()));
    }
}
