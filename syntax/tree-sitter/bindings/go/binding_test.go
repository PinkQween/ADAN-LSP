package tree_sitter_adan_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_adan "github.com/tree-sitter/tree-sitter-adan/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_adan.Language())
	if language == nil {
		t.Errorf("Error loading ADAN grammar")
	}
}
